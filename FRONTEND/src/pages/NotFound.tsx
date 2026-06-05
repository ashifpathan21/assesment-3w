import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Typography>Page Not Found</Typography>
      <Button onClick={() => navigate("/")}>Go to home</Button>
    </div>
  );
};

export default NotFound;
