import { Card, createStyles, IconButton, TextField, Theme, withStyles } from "@material-ui/core";

export const AddBranchInput = withStyles((theme: Theme) =>
createStyles({
  root: {
    width: "66%",
    marginTop: '33%',
    transform: 'translate(25%, -50%)',
    zIndex: 2,
    "& .MuiInputBase-root": {
      color: theme.palette.secondary.dark,
    },
    '& .MuiFormLabel-root': {
      color: theme.palette.secondary.main,
    },
    '& label.Mui-focused': {
      color: theme.palette.secondary.dark,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.secondary.main,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.secondary.dark,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.secondary.dark,
      },
    },
    },
})
)(TextField);

export const Btn = withStyles((theme: Theme) =>
createStyles({
  root: {
    width: '100%',
    height: '100%',
    zIndex: 2,
    color: theme.palette.secondary.main,
  '&:hover': {
    color: theme.palette.secondary.dark,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '4vw',
  }
}}))(IconButton);

export const HelpCard = withStyles((theme: Theme) =>
createStyles({
  root: {
    backgroundColor: '#00000086',
    color: theme.palette.secondary.main,
    '& .MuiTypography-body1': {
      fontFamily: 'Comfortaa, Roboto, sans-serif;'
    }
}}))(Card);
