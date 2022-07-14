// this is a higher order function
// to handle or catch async function errors
//

export default (theFunction) => (req, res, next) => {
  Promise.resolve(theFunction(req, res, next)).catch(next);
};

// export default catchAsyncErrors;
