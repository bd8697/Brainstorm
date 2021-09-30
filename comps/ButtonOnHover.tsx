import { AnimatePresence, motion, useAnimation } from "framer-motion";
import React, { Fragment, useEffect, useState } from "react";
import classes from "./ButtonOnHover.module.css";
import {global } from '../Utility/Utility'
import Image from 'next/image'

const ButtonOnHover = (props: { name:string, transform: {x: number, y: number, size: number}; popBy: {x:number, y: number}; render: boolean, onClick?: () => void, children?: React.ReactNode }) => {
  const [animations, setAnimations] = useState<any>({
    init: {
      x: 0,
      y: 0,
      scale: 0,
      opacity: 0,
    },
    in: {
      x: props.popBy.x,
      y: props.popBy.y,
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 100,
        stiffness: 500,
        bounce: 1,
      },
    },
    out: {
      x: 0,
      y: 0,
      scale: 0,
      transition: {
        type: "spring",
        damping: 100,
        stiffness: 500,
        bounce: 1,
      },
    },
    onHover: {
      scale: 1.25,
      transition: {
        type: "spring",
        damping: 50,
        stiffness: 500,
        bounce: 1,
      },
    },
  });

  const [transform, setTransform] = useState({
    top: props.transform.y - props.transform.size / 2 / 2,
    left: props.transform.x - props.transform.size / 2 / 2,
    width: props.transform.size / 2,
    height: props.transform.size / 2,
  });
  // set initial state => first render = > compDidMount => second render

  return (
    <AnimatePresence>
      {props.render && (
          <motion.div
            key={props.name + '_' + props.popBy.x + '_' + props.popBy.y}
            initial={"init"}
            animate={"in"}
            exit={"out"}
            whileHover={"onHover"}
            variants={animations}
            style={transform}
            className={classes.buttonOnHover}
          >
            <div className = {classes.btnUI}>
              {props.children}
            </div>
            <Image alt = "*" src={global.blackhole} className={classes.starImg}></Image>
          </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ButtonOnHover;
