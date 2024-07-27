"use client"
import AboutMe from '@/components/AboutMe'
import Bio from '@/components/Bio'
import Contact from '@/components/Contact'
import Navbar from '@/components/Navbar'
import Project from '@/components/Project'
import Services from '@/components/Services'
import Technologies from '@/components/Technologies'
import React from 'react'

const page = () => {
  return (

    <div className='main p-5 w-full bg-slate-200'>
      <Navbar />
      <section id="Home">
        <Bio />
      </section>
      <section id="About">
        <AboutMe />
      </section>
      <section id="Technologies">
        <Technologies />
      </section>
      <section id="Projects">
        <Project />
      </section>
      <section id="Services">
        <Services />
      </section>
      <section id="Contact">
        <Contact />
      </section>
    </div>
  );
};

export default page
