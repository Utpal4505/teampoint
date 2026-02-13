"use client";

function page() {

  const handlegoole = () => {
    window.location.href = "http://localhost:8000/api/v1/auth/google"
  }
  return (
    <div className='text-red-500 p-5 rounded-2xl bg-amber-200 m-4 w-20'>Login
    <button onClick={handlegoole}>Login</button>
    </div>
  )
}

export default page