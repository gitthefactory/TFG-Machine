import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

interface GameCardProps {
  provider_name: string;
  provider: number;
  imageUrl: string;
}

const GameCard: React.FC<GameCardProps> = ({ provider_name, provider, imageUrl }) => {
  return (
    <Card sx={{ display: 'flex', height: '100%', width: '300px', margin: '10px' }}>
      <CardMedia
        component="img"
        sx={{ width: 100, minWidth: 100 }}
        image={imageUrl}
        alt={provider_name}
      />
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h6" component="div" gutterBottom>
          {provider_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Provider ID: {provider}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GameCard;
