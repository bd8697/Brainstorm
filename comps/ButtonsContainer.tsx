import React, { Fragment, memo } from 'react'

export const ButtonsContainer = (props: { children: React.ReactNode }) => {
    return (
        <Fragment>
                {props.children}
        </Fragment>
    )
}

export default memo(ButtonsContainer)
