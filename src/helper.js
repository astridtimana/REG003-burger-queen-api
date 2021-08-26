const objectId = require("mongoose").Types.ObjectId; // es un schemaType de objectId de mongoose

const linkHeader = (limit, page, totalPages , url, response) =>{
 const link = {
    first: `${url}?limit=${limit}&page=1`,
    next: response.hasNextPage ? `${url}?limit=${limit}&page=${page+1}` : `${url}?limit=${limit}&page=${page}`,
    prev: response.hasPrevPage ? `${url}?limit=${limit}&page=${page-1}` :`${url}?limit=${limit}&page=${page}` , 
    last: `${url}?limit=${limit}&page=${totalPages}`,
}
    return link;
};

const validObjectId= (id) => objectId.isValid(id);

const validEmail = (email) => {
    let regEx = /\S+@\S+/;
    return regEx.test(email);
};



module.exports={
    linkHeader,
    validObjectId,
    validEmail
}