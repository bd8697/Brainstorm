import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Star from "./Star";
import { global } from "../Utility/Utility";
import Transform from "../Entities/Transform";
import classes from "./Loading.module.css";

const loaderVariants = {
  yoyo: {
    scale: [1, 1.5],
    rotate: 360,
    transition: {
      rotate: {
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop" as const, // -____-
      duration: global.fadeOutTermDuration * 2},
      scale: {
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse" as const, // -____-
      duration: global.fadeOutTermDuration * 2},
      }
  },
  out: {
    opacity: 0,
    transition: { ease: "easeInOut", duration: global.fadeOutTermDuration / 2 },
  },
};

const Loading = (props: { render: boolean }) => {
  const [transform, setTransform] = useState<Transform>(
    global.defaultTransform
  ); // window not defined here
  const [renderStar, setRenderStar] = useState(false);

  useEffect(() => {
    setTransform(
      new Transform(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 25, true)
    );
    setRenderStar(true);
  }, []);

  return (
    <AnimatePresence>
      {props.render && (
        <motion.div
          className={classes.loadingContainer}
          variants={loaderVariants}
          animate="yoyo"
          exit="out"
        >
          {renderStar && (
            <Star
              name="loading"
              img={global.blackhole}
              render={true}
              transform={transform}
              setActiveName={() => {}}
              ignoreChildren={true}
              static={true}
            ></Star>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loading;
