const SignIn = () => {
  return (
    <div className="h-screen backgroundBlue flex items-center justify-center">
        <div className="w-[50%] h-[50%] navbarColor rounded-lg flex flex-col items-center">
            <div className="postTitleColor rounded-lg flex w-[50%] h-[10%] mt-[10%] justify-center">
                <p className="text-white text-[175%]">Sign In</p>
            </div>
            <div className="bg-white rounded-lg flex px-[2%] w-[80%] h-[8%] mt-[5%] justify-center">
                <p className="text-black text-[125%]">Enter your email address here:</p>
            </div>
            <div className="bg-white rounded-lg flex px-[2%] w-[80%] h-[8%] mt-[2%] justify-center">
                <p className="text-black text-[125%]">Enter your password here:</p>
            </div>
            
        </div>
    </div>
  )
}

export default SignIn