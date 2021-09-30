import { AnimatePresence, motion, useAnimation } from "framer-motion";
import React, { memo, useEffect, useRef} from "react";
import { useState } from "react";
import { random, randomInt } from "../Utility/Utility";
import classes from "./Star.module.css";
import StarData from "./StarData";
import Image from 'next/image'
import {global} from '../Utility/Utility'
import { useTheme } from "@material-ui/core";

const Star = (props: {transform: {x: number, y: number, size: number, render: boolean}, name: string, score?: number, render: boolean, outDuration?: number, color?: string, static?: boolean, img: StaticImageData, onDelete?: (name: string) => void, onAction?: (name: string) => void, ignoreChildren?: boolean, setActiveName: (name: string) => void, children?: React.ReactNode}) => {
  const anim = useAnimation();
  const initSize = useRef(props.transform.size)
  const [isDark, setIsDark] = useState(props.img.height !== props.img.width)
  const [transform, setTransform] = useState({
  });
  const [animations, setAnimations] = useState<any>({
    init: {
      opacity: 0,
      x: (window.innerWidth / 2 - (window.innerWidth - props.transform.x)) * 2,
      y: (window.innerHeight / 2 - (window.innerHeight - props.transform.y)) * 2,
    },
    in: {
      scale: 0
    },
  });

  useEffect(() => {
    setAnimations({
      in: {
        opacity: [0, 1],
        scale: [0, 1],
        x: window.innerWidth / 2 - (window.innerWidth - props.transform.x),
        y: window.innerHeight / 2 - (window.innerHeight - props.transform.y),
        // rotate: props.static? 0 : 360 * randomInt(1, 3),
        transition: { ease: "easeOut", duration: props.static? 0.5 : random(1, 3) },
      },
      idle: {
        scale: 1.25,
          transition: { 
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse" as const,
            duration: random(2.5, 5),
          }
      },
      out: {
        opacity: 0,
        scale: 0,
        x: 0,
        y: 0,
        // rotate: 360 * randomInt(1, 3),
        transition: { ease: "easeIn", duration: random(1, 2) },
      },
      onHover: {
        scale: 1.5,
        transition: global.defaultSpringCfg,
      },
      onUpvote: {
        scale: 1.5,
        transition: global.defaultSpringCfg,
      },
      onDownvote: {
        scale: 0.5,
        transition: global.defaultSpringCfg,
      }
    });
  }, []);

  useEffect(() => {
    const onInit = async() => {
      if (animations.in) {
        await anim.start("in");
        isDark && await anim.start("idle")
      }
    }
    onInit();
  }, [animations]);

    useEffect(() => {
    if(props.transform.size > initSize.current) {
      anim.start("onUpvote");
    } else {
      anim.start("onDownvote");
    }
  }, [props.transform.size]);

  useEffect(() => {
    setTransform({
      top: window.innerHeight / 2 - props.transform.size / 2,
      left: window.innerWidth / 2 - props.transform.size / 2,
      width: props.transform.size,
      height: props.transform.size,
      fontSize: props.transform.size / 5,
    });
  }, [props.transform])

  const getOverlay = () => {
    return props.score !== undefined? (props.img === global.star1? classes.star1 : classes.star2) : ''
  }

  const autoDestroy = () => {
      props.onDelete && props.onDelete(props.name);
  }

  const onMouseEnter = () => {
      props.setActiveName(props.name);
  };

  const onAction = () => {
    props.onAction && props.onAction(props.name)
  }

  return (
        <AnimatePresence onExitComplete={autoDestroy}>
        {props.render &&
          <motion.div
            key={props.name}
            initial={"init"}
            animate={anim}
            variants={animations}
            whileHover={props.static? "none" : "onHover"}
            transition={global.defaultSpringCfg}
            onMouseEnter={onMouseEnter}
            exit={"out"}
            style={transform}
            className={classes.motion}
            onClick={onAction}
          >
            <div className={classes.dataContainer}>
                {!props.ignoreChildren && <StarData name = {props.name} score = {props.score} isDark={isDark}></StarData>}
                {props.children}
            </div>
            <div className = {`${classes.imgContainer} ${isDark && classes.starImg}`}>
              <Image alt="*" src={props.img} className={classes.trueImg}></Image>
              <div className = {`${classes.trueImg} ${classes.imgOverlay} ${getOverlay()}`} style={{background: props.color}}></div>
            </div>
 
          </motion.div>
          }
          </AnimatePresence>
  );
};

// rerender = return false
// CAN fully customize this, passing everything through children, and controlling wether to rerender or not through props
// todo: maybe dont need callbacks anymore cause of this?

// if input, never rerender, if data, rerender if it changed
export default memo(Star, (prevProps, nextProps) => {
  if(nextProps.ignoreChildren) {
    return true
  }
  if(prevProps.score !== nextProps.score || prevProps.render !== nextProps.render || prevProps.outDuration != nextProps.outDuration) {
    return false
  } else {
    return true
  }
  })
