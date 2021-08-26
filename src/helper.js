const linkHeader = (limit, page, totalPages , url, response) =>{
 const link = {
    first: `${url}?limit=${limit}&page=1`,
    next: response.hasNextPage ? `${url}?limit=${limit}&page=${page+1}` : `${url}?limit=${limit}&page=${page}`,
    prev: response.hasPrevPage ? `${url}?limit=${limit}&page=${page-1}` :`${url}?limit=${limit}&page=${page}` , 
    last: `${url}?limit=${limit}&page=${totalPages}`,
}
    return link;
}

module.exports={
    linkHeader
}