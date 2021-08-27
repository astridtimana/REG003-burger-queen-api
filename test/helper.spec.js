const {
    linkHeader,
    validObjectId,
    isEmptyObj,
    validEmail
} = require('../src/helper');

describe('is the object empty ?', () => {
    it('should be false ', () => {
      expect(isEmptyObj({'email': 'admin@localhost', 'paswword': 'changeme'})).toBe(false)
    })
    it('should be true', () => {
      expect(isEmptyObj({})).toBe(true)
    })
});

describe('is the email valid ?', () => {
    it('should be true ', () => {
      expect(validEmail('admin@localhost')).toBe(true)
    })
    it('should be false', () => {
      expect(validEmail('admin')).toBe(false)
    })
});

describe('is the email valid ?', () => {
    it('should be get pagination links ', () => {
        const limit = 5 
        const page = 1
        const totalPages = 7
        const url = 'http://localhost:8080/users'
        const response = {'hasNextPage': true , 'hasPrevPage': false}

      expect(linkHeader(limit, page,totalPages, url, response)).toEqual({
          'first': 'http://localhost:8080/users?limit=5&page=1',
          'next': 'http://localhost:8080/users?limit=5&page=2',
          'prev': 'http://localhost:8080/users?limit=5&page=1',
          'last': 'http://localhost:8080/users?limit=5&page=7',
      })
    });
    it('should be pagination links ', () => {
        const limit = 5 
        const page = 7
        const totalPages = 7
        const url = 'http://localhost:8080/users'
        const response = {'hasNextPage': false , 'hasPrevPage': true}

      expect(linkHeader(limit, page,totalPages, url, response)).toEqual({
          'first': 'http://localhost:8080/users?limit=5&page=1',
          'next': 'http://localhost:8080/users?limit=5&page=7',
          'prev': 'http://localhost:8080/users?limit=5&page=6',
          'last': 'http://localhost:8080/users?limit=5&page=7',
      })
    });
});
// describe('is the ObjectId valid ?', () => {
// //     it('should be true ', () => {
// //       expect(validObjectId('8E31df5')).toBe(true)
// //     })
//     it('should be false', () => {
//       expect(validObjectId('admin@localhost')).toBe(false)
//     })
// });

  