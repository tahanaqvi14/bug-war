import React, { useRef } from 'react'
import './Signup.css'
import { useMutation, gql } from '@apollo/client'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';



const input_text1 = ['D', 'i', 's', 'p', 'l', 'a', 'y', '\u00A0', 'N', 'a', 'm', 'e'];
const input_text2 = ['U', 's', 'e', 'r', 'n', 'a', 'm', 'e'];
const input_text3 = ['P', 'a', 's', 's', 'w', 'o', 'r', 'd'];

const CREATE_USER_MUTATION = gql`
    mutation user_creation($input: createuser!){
        user_creation(input:$input){
            success
            message
        }
    }
`


const Singup = () => {
  const btnRef = useRef();
  const navigate = useNavigate();


  const [create_User] = useMutation(CREATE_USER_MUTATION);
  // const [create_User, { data, loading, error }] = useMutation(CREATE_USER_MUTATION);

  const displayRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();


  function showLoader() {
    btnRef.current.disabled = true;
    document.getElementById('submit-button').innerHTML = '<div id="loader"></div>';
    document.getElementById('submit-button').classList.remove('button1');
    
  }
  function hideLoader() {
    btnRef.current.disabled = false;
    document.getElementById('submit-button').innerHTML = 'Create Account';
    document.getElementById('submit-button').classList.add('button1');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const displayname = displayRef.current.value;
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    
    showLoader();
    const a=await create_User({ variables: { input: { displayname: displayname, username: username, password: password } } });
    if (a.data.user_creation.success==false) {
      toast.error(a.data.user_creation.message, {
        position: "top-center", 
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }else{
      toast.success('Account Created', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
    // navigate('/page2');
    navigate('/');
    hideLoader();
  }

  function goto_login() {
    navigate('/');
  }


  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="rounded-3xl bg-[#fce9b8] border-4 border-[#7f4f0a] shadow-[6px_6px_0_0_#7f4f0a] w-full max-w-md p-6 flex flex-col gap-4 text-[#5a3a1a]">
        <div className="flex justify-between">
          <div>
            <div className="text-lg font-semibold">
              Create your account
            </div>
            <div className="text-base">
              Enter your details below to get started
            </div>
          </div>
          <button onClick={goto_login} className="bg-[#F4B24B] font-bold px-2 button1 rounded-md py-2">Login</button>
        </div>


        <form aria-label="Sign up form" className="rounded-3xl w-full max-w-md p-4 relative" onSubmit={handleSubmit}>

          <div className="wave-group">
            <input required type="text" name="name" id="name" className="input" ref={displayRef} />
            <span className="bar"></span>
            <label htmlFor="name" className="label text-[#6b4a1e] font-semibold text-xl mb-2 select-none">
              {input_text1.map((value, index) => (
                <span key={index} className="label-char" style={{ "--index": index }}>{value}</span>
              ))}
            </label>
          </div>

          <div className="wave-group">
            <input required type="text" name="username" id="username" className="input" ref={usernameRef} />
            <span className="bar"></span>
            <label htmlFor="displayname" className="label text-[#6b4a1e] font-semibold text-xl mb-2 select-none">
              {input_text2.map((value, index) => (
                <span className="label-char" key={index} style={{ "--index": index }}>{value}</span>
              ))}
            </label>
          </div>

          <div className="wave-group">
            <input required type="password" name="password" id="password" className="input" ref={passwordRef} />
            <span className="bar"></span>
            <label htmlFor="password" className="label text-[#6b4a1e] font-semibold text-xl mb-2 select-none">
              {input_text3.map((value, index) => (
                <span className="label-char" style={{ "--index": index }}>{value}</span>
              ))}
            </label>
          </div>

          <button
            ref={btnRef}
            className="button1 font-fredoka text-2xl text-[#6b4a1e] bg-[#f4b24a] rounded-xl w-full py-3 mb-6 select-none"
            type="submit" id='submit-button' >
            Create Account
          </button>
        </form>
      </div>

    </div>
  )
}

export default Singup
