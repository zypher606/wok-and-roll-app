import { Button } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import { red } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import ShareIcon from '@material-ui/icons/Share';
import React, { useState } from 'react';

import { ItemQuantity } from '..';

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
    },
    cardHeader: {
      '& span': {
        fontSize: '1.2rem',
      }
    }
  }),
);

export const ItemCard = ({item: {id, name, price, description, imageURL}, handleQuantityChange}: any) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleAddItemClick = () => {
    setQuantity(1);
    handleQuantityChange({id, quantity: 1});
  }

  const handleItemQuantityChange = (q: number) => {
    setQuantity(q);
    handleQuantityChange({id, quantity: q});
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" style={{backgroundColor: '#3f51b5'}} className={classes.avatar}>
            {name.slice(0, 1)}
          </Avatar>
        }
        className={classes.cardHeader}
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
          <ShareIcon style={{color: '#3f51b5'}} />
        </IconButton>

        <Typography variant="h6">
          ₹ {price}
        </Typography>

        <div className={classes.itemQuantity}>
          {
            quantity === 0 &&
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleAddItemClick}
              endIcon={<AddIcon/>}
            >
              Add
            </Button>
          }

          {
            quantity > 0 &&
            <ItemQuantity handleChange={handleItemQuantityChange} quantity={quantity} />
          }
          
            
        </div>
      </CardActions>
    </Card>
  );
}