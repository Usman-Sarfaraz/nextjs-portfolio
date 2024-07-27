import React from "react";
import {useState} from "react"
import { BsMoonStarsFill } from "react-icons/bs";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-scroll"


const Navbar = () => {

  const [navIcon, setNavIcon] = useState(false);

  const navLinks = [
    { id: 1, navName: 'Home' },
    { id: 2, navName: 'About' },
    { id: 3, navName: 'Technologies' },
    { id: 4, navName: 'Projects' },
    { id: 5, navName: 'Services' },
    { id: 6, navName: 'Contact' }
  ];
  return (

    <section>

      <nav className="flex items-center justify-between font-semibold px-10 pt-2">

        <h1 className="text-xl z-10">Developed by Usman.</h1>

        
          <ul className="hidden lg:flex ">
            {
              navLinks.map(({navName, id})=>{
                return(
                  <li key={id} className=" text-slate-700 text-lg cursor-pointer tracking-wide hover:scale-105 hover:text-slate-800 duration-100 ml-10 ">
                    <Link to={navName} smooth duration={750}>
                        {navName}
                    </Link>
                  </li>
                )
              })
            }
          </ul>


          <div onClick={()=>setNavIcon(!navIcon)} className="lg:hidden text-2xl cursor-pointer z-10 text-slate-900 hover:scale-105" >
            {
              navIcon? <FaTimes /> : <FaBars /> 
            }           
          </div>

          {
            navIcon && (
              <ul className="lg:hidden flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-slate-600 to-slate-400 " >
                {
                  navLinks.map(({navName, id})=>{
                    return(
                      <li key={id} className="text-3xl pb-8 cursor-pointer tracking-wide hover:scale-105 hover:text-slate-900 duration-100">

                        <Link 
                          to={navName}
                          onClick={()=>setNavIcon(!navIcon)}
                          smooth 
                          duration={750}
                        >
                          {navName}
                          
                        </Link>

                      </li>
                    )
                  })
                }
              </ul>
            )
          }

      </nav>


    </section>
  );
};

export default Navbar;
