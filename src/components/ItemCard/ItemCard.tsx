import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import burgerImage from "../../assets/images/burger.jpg"; 
import { ItemQuantity } from '..';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    avatar: {
      backgroundColor: red[500],
    },
    itemQuantity: {
      marginLeft: 'auto',
    }
  }),
);

export const ItemCard = ({item: {id, name, price, description, imageURL}, handleDelete}: any) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {name.slice(0, 1)}
          </Avatar>
        }
        action={
          <IconButton onClick={() => handleDelete(id)} aria-label="delete">
            <DeleteOutlinedIcon />
          </IconButton>
        }
        title={name}
      />
      <CardMedia
        className={classes.media}
        image={imageURL}
        title={name}
      />
      <CardActions disableSpacing>
        {/* <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton> */}
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>

        <Typography variant="h6">
          ₹ {price}
        </Typography>

        <div className={classes.itemQuantity}>
          <ItemQuantity handleChange={() => {}} quantity={0} />
        </div>
      </CardActions>
    </Card>
  );
}