const { JsonWebTokenError } = require('jsonwebtoken');
const {
    isAuthenticated,
    isAdmin,
    requireAuth,
    requireAdmin,    
} = require('../src/middleware/auth');

const next = jest.fn();

const req = {
    decoded: {
        "id": "6122eabe6d74092b178803f2",
        "roles": {
          "admin": true
        },
        "email": "admin@localhost",
        "iat": 1630023475,
        "exp": 1630045075
    }
}
const req_2 = { }

const req_3 = {
    decoded: {
        "id": "8962eabe7d74092b1716803w4",
        "roles": {
          "admin": false
        },
        "email": "chef@localhost",
        "iat": 3630018471,
        "exp": 3630002971
    }
 }


describe('is the user authenticated ?', () => {
    it('should be true ', () => {
      expect(isAuthenticated(req)).toBeTruthy()
    })
    it('should be false', () => {
      expect(isAuthenticated(req_2)).toBeFalsy()
    })
});

describe('is the user admin ?', () => {
    it('should be true ', () => {
      expect(isAdmin(req)).toBeTruthy()
    })
    it('should be false', () => {
      expect(isAdmin(req_3)).toBeFalsy()
    })
});

