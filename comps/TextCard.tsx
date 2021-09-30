import { CardActions, CardContent, Typography } from '@material-ui/core'
import React, { Fragment, useState } from 'react'
import classes from './TextCard.module.css'
import { Btn, HelpCard } from '../Utility/MuiCompsStyles';
import { AnimatePresence, motion } from 'framer-motion';

const TextCard = (props: { transform: { y: number; size: number; x: number; render: boolean; }, text: string[] }) => {
  const [transform, setTransform] = useState({
    top: props.transform.y - props.transform.size / 2,
    left: props.transform.x,
    transform: 'translate(-120%, 0)',
    width: props.transform.size * 4,
    maxHeight: props.transform.size,
  });
    return (
      <AnimatePresence>
      {props.transform.render &&
      <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1, transition: { ease: "easeInOut", duration: 0.5 }}}
      exit={{opacity: 0, transition: { ease: "easeInOut", duration: 0.5 }}}
      >
        <HelpCard style={transform} className={classes.card}>
        <CardContent>
          {props.text.map((text) => {
            return (
              <Typography key = {text} className={classes.helpText} gutterBottom>
              {text}
            </Typography>)
          })}
        </CardContent>
        <CardActions>
        </CardActions>
      </HelpCard>       
      </motion.div>
      }
</AnimatePresence>
    )
}

export default TextCard