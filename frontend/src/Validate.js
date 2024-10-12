import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Spinner from './Spinner';

function Validate(props) {

    const [condition, setCondition] = useState(null);
    const [validated, setValidated] = useState(null);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    const getData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/reference/' + id);

            if (response.status === 200) {
                setValidated(response.data["reference"]["fulfilled"]);
                setCondition(response.data["reference"]["components"]["condition"]);
                setLoading(false);
                console.log(response);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error referencing escrow:', error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const validate = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/validate/' + id);

            if (response.status === 200 && response.data["success"]) {
                setValidated(true);
                setLoading(false);
                console.log(response);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error validating escrow:', error);
        }
    };


    if (loading) {
        return (
            <div className="relative m-auto flex h-screen">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="relative m-auto flex h-screen">
            <div className='relative m-auto h-2/3 p-2.5 pb-4 rounded shadow-md w-1/3 bg-slate-100'>
                <span className="text-xl mb-2 font-bold block">Validate an Escrow Agreement</span>
                <span className="text-md mb-4 block">Validate the condition listed below has been met by clicking the green button.</span>
                <br />
                <div className={`relative z-0 w-full mb-6 group h-fit p-4 pt-2 rounded-lg ${validated ? "bg-green-200" : "bg-white"}`}>
                    <span className="text-xl font-semibold"> Status: &nbsp;  &nbsp; {validated ? "Complete" : "Pending"} </span>
                    {validated ? null :
                        <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 mb-1 text-gray-200 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                        </svg>
                    }
                </div>

                <label for="message" class="block mb-2 text-sm font-medium text-gray-900 ">Escrow condition</label>
                <textarea id="message" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border mb-5 border-gray-300 focus:ring-blue-500 focus:border-blue-500" disabled value={condition}></textarea>

                <button type="submit" onClick={validate} className="absolute object-bottom py-2 px-3 mb-6 mx-auto rounded text-center text-white bg-green-500 cursor-pointer hover:bg-green-400 focus:bg-green-600" >Validate</button>
            </div>
        </div>
    );
};

export default Validate;