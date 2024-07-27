import React from 'react'
import { FaLinkedin, FaSquareFacebook, FaInstagram } from "react-icons/fa6";
import { motion } from "framer-motion"


const Contact = () => {
  return (
    <section className='mb-16'>

      <div>

        <div className='text-center text-slate-800 font-semibold text-[42px] mb-20'>
            <span className='border-b-2 border-slate-600 pb-2 bg-gradient-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent'>Get In <span className='text-slate-500 font-bold'>Touch</span></span>
        </div>

        <div className='text-center'>
          <motion.h3 
            whileInView={{opacity:1, x:0}}
            initial={{x : -100, opacity : 0}}
            transition = {{duration : 0.5 , delay : 0}}
            className='tracking-widest mb-5 text-slate-700 text-lg'
          >
            uk48353@gmail.com
          </motion.h3>

          <motion.h3 
            whileInView={{opacity : 1, x : 0}}
            initial={{x : -100, opacity : 0}}
            transition = {{duration : 0.5 , delay : 0.5}}
            className='tracking-widest mb-7 text-slate-700 text-base'
          >
            +92 322 4673952
          </motion.h3>

        </div>

        <motion.div 
          initial={{
                  scale: 0,
                  rotate: 0, }}
          whileInView={{
                  scale: 1,
                  rotate: 0, 
                }}
          transition = {{duration : 0.5 , delay : 0.7}}
          className="flex justify-center items-center text-4xl gap-10 text-slate-700"
        >
          <a href="https://www.linkedin.com/in/mian-usman-sarfraz/" target="_blank"><FaLinkedin className="cursor-pointer hover:text-slate-900 " /></a>
          <a href="https://www.facebook.com/profile.php?id=100008393641000" target="_blank"><FaSquareFacebook className="cursor-pointer  hover:text-slate-900 " /></a>
          <a href="https://www.instagram.com/osman.sarfraz_/" target="_blank"><FaInstagram className="cursor-pointer  hover:text-slate-900 " /></a>
        </motion.div>

      </div>
      
    </section>
  )
}

export default Contact
