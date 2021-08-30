const  errorHandler  = require('../src/middleware/error');

const error = {
    name: "error",
    statusCode: 500,
    message: "Internal Server Error",
    error: "Internal Server Error"
  };

const error2 = {
    name: "error2",
    statusCode: 401,
    message: "Unauthorized",
    error: "Unauthorized"
  };

const error3 = {
    name: "error3",
    error: "Fail"
  };

const next = jest.fn();

describe('error', () => {
    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
          status: jest.fn().mockReturnThis(), // This line
          json: jest.fn().mockReturnThis(), // This line
          send: jest.fn(), // also mocking for send function
        };
      })

    it('errorHandler - statusCode 500', () => {
        errorHandler(error, mockRequest, mockResponse, next);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({statusCode:500, message:"Internal Server Error"});
        expect(next).toHaveBeenCalledTimes(1);
    })
    it('errorHandler - statusCode 401', () => {
        errorHandler(error2, mockRequest, mockResponse, next);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({statusCode:401, message:"Unauthorized"});
        expect(next).toHaveBeenCalledTimes(2);
    })
    it('errorHandler - empty statusCode ',  () => { // preguntar sobre async await
        errorHandler(error3, mockRequest, mockResponse, next);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({statusCode:500, message:"Internal server error"});
        expect(next).toHaveBeenCalledTimes(3);
    })

});
