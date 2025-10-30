import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '50px 20px', textAlign: 'center' }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button 
            type="primary" 
            onClick={() => navigate('/')} // Navigate to the Home route
          >
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;