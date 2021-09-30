import { Tooltip } from '@material-ui/core'
import React, { memo, useState } from 'react'
import classes from './StarData.module.css'
import Zoom from '@material-ui/core/Zoom';
import { useTheme } from '@material-ui/core';

export const StarData = (props: { name: string, score?: number, isDark: boolean}) => {
    const theme = useTheme();
    const [name, setName] = useState(() => props.name.replace(/_/g, " "))
    const style = {
        color: props.isDark ? theme.palette.primary.main : theme.palette.secondary.main
    }
    return (
        <div className = {classes.dataContainer} style = {style}>
            <p className = {classes.data + ' ' + (!props.score ? classes.big : '')}>{name}</p>
            {props.score &&             
            <Tooltip TransitionComponent={Zoom} enterDelay={1000} title={<p className= {classes.tooltip}>Score</p>} >
            <p className = {classes.data + ' ' + classes.score}>{props.score}</p>
            </Tooltip>}
        </div>
    )
}

export default StarData