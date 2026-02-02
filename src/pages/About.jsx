import { Button } from "flowbite-react";
import React from "react";
import { customHistory } from "../_helpers";
const AboutPage = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-blue-500">About</h1>
        <p className="text-lg text-gray-500">
          This is a medical appointment application that helps you manage your appointments effectively.
        </p>
          <Button color='cyan'  className='justify-center py-0' onClick={()=> customHistory.navigate(-1)}>Back</Button>
      </div>
    );
  };
  export default AboutPage