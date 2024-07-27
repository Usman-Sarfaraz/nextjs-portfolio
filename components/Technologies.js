import React from 'react'
import { FaHtml5, FaReact } from "react-icons/fa";
import { IoLogoCss3 } from "react-icons/io";
import { RiJavascriptFill, RiTailwindCssFill } from "react-icons/ri";
import { TbBrandFramerMotion } from "react-icons/tb";
import { motion } from "framer-motion"


const Technologies = () => {

  return (

    <section className='mb-52 pt-6'>

        <div>

            <div className='py-16 text-5xl flex justify-center font-semibold '>
                <span className='bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent p-2 border-b-2 border-slate-600 pb-3'>Technologies</span>
            </div>

            <motion.div
                initial={{x : -100, opacity : 0}}
                whileInView={{x : 0, opacity : 1}}
                transition = {{duration : 0.5 , delay : 0}}
                className='text-center font-rubik text-slate-600 pb-24'>
                    <p className='tracking-wider'>These are the some Technologies I have worked with.</p>
            </motion.div>

            <div                
                className='flex flex-wrap justify-center items-center gap-3'
            >
                    <motion.div 
                    initial={{y : -10}}
                    animate={{y:[10, -10]}} 
                    transition = {{duration : 2 , ease: "linear", repeat: Infinity, repeatType: "reverse",}}
                    className='rounded-3xl p-3 border-4 border-slate-700'
                    >
                        <FaHtml5 className='text-8xl text-orange-600'/>
                    </motion.div>

                    <motion.div 
                    initial={{y : 10}}
                    animate={{y:[10, -10]}} 
                    transition = {{duration : 2.3 , ease: "linear", repeat: Infinity, repeatType: "reverse",}}className='rounded-3xl p-3 border-4 border-slate-700'
                    >
                        <IoLogoCss3 className='text-8xl text-blue-600'/>
                    </motion.div>

                    <motion.div 
                    initial={{y : -10}}
                    animate={{y:[10, -10]}} 
                    transition = {{duration : 2 , ease: "linear", repeat: Infinity, repeatType: "reverse",}} className='rounded-3xl p-3 border-4 border-slate-700'
                    >
                        <RiJavascriptFill className='text-8xl text-yellow-500'/>
                    </motion.div>

                    <motion.div 
                    initial={{y : 10}}
                    animate={{y:[10, -10]}} 
                    transition = {{duration : 2.3 , ease: "linear", repeat: Infinity, repeatType: "reverse",}} className='rounded-3xl p-3 border-4 border-slate-700'
                    >
                        <FaReact className='text-8xl text-cyan-500'/>
                    </motion.div>

                    <motion.div 
                    initial={{y : -10}}
                    animate={{y:[10, -10]}} 
                    transition = {{duration : 2 , ease: "linear", repeat: Infinity, repeatType: "reverse",}} className='rounded-3xl p-3 border-4 border-slate-700'
                    >
                        <RiTailwindCssFill className='text-8xl text-cyan-400'/>
                    </motion.div>

                    <motion.div 
                    initial={{y : 10}}
                    animate={{y:[10, -10]}} 
                    transition = {{duration : 2.3 , ease: "linear", repeat: Infinity, repeatType: "reverse",}} className='rounded-3xl p-3 border-4 border-slate-700'
                    >
                        <TbBrandFramerMotion className='text-8xl text-[#c42cb8] '/>
                    </motion.div>
            </div>
        
        </div>

    </section>

  )
}

export default Technologies
