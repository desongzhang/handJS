const sum = [1,2,3,4,5].reduce((pre,v,index,arr)=>{
    console.log(index,arr);
    
    return pre + v
})
console.log(sum);
