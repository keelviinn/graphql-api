const filterObj = (obj: { [x: string]: any; }, ...allowedFields: string[]) => {
  let newObj: any = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
 };

 export default filterObj;