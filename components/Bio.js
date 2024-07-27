import React from "react";
import { FaLinkedin, FaSquareFacebook, FaInstagram } from "react-icons/fa6";
import { motion } from "framer-motion"


const container = (delay)=>({
    initial : {x : -100, opacity : 0},
    animate : {
      x : 0,
      opacity : 1,
      transition : {duration : 0.8 , delay : delay},
    },
})

const Bio = () => {
  return (
    <section className="pt-20 mb-24">
      <div className="text-center mb-8">
        <motion.h1 
          variants={container(0)}
          initial="initial"
          animate="animate"
          className=" text-2xl lg:text-4xl font-semibold bg-gradient-to-r from-slate-900 via-slate-600 to-slate-400 bg-clip-text text-transparent p-2"
        >
          Mian Usman Sarfraz

        </motion.h1>

        <motion.h2
          variants={container(0.5)}
          initial="initial"
          animate="animate" 
          className=" text-xl lg:text-2xl mt-2 font-semibold text-slate-800"
        >
          React.js Developer
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition = {{duration : 0.5 , delay : 1}}
          className=" mt-4 w-[60vw] m-auto text-slate-600 tracking-wide"
        >
          Skilled React.js developer with expertise in building dynamic and
          performant web applications. Passionate about creating seamless user
          experiences through component-based architecture.
        </motion.p>

      </div>

      <motion.div 
        initial={{ x: 0,
                  y: 0,
                  scale: 0,
                  rotate: 0, }}
        animate={{x: 0,
                  y: 0,
                  scale: 1,
                  rotate: 0, 
                }}
        className="flex justify-center items-center text-4xl gap-7 text-slate-700">
          <a href="https://www.linkedin.com/in/mian-usman-sarfraz/" target="_blank"><FaLinkedin className="cursor-pointer hover:text-slate-900 " /></a>
          <a href="https://www.facebook.com/profile.php?id=100008393641000" target="_blank"><FaSquareFacebook className="cursor-pointer  hover:text-slate-900 " /></a>
          <a href="https://www.instagram.com/osman.sarfraz_/" target="_blank"><FaInstagram className="cursor-pointer  hover:text-slate-900 " /></a>
      </motion.div>

      <motion.div 
        initial={{ x: 0,
                  y: -100,
                  scale: 0,
                  rotate: 0, }}
        animate={{x: 0,
                  y: 0,
                  scale: 1,
                  rotate: 0, 
                }}
        transition = {{duration : 0.5 , delay : 1}}
        className="flex justify-center mt-8 ">
        <img src="images/usman.webp" alt="" className="h-72 w-[298px] rounded-full " />
      </motion.div>
    </section>
  );
};

export default Bio;
