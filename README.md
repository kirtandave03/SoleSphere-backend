# SoleSphere-backend

routes : 
 index :
    auth : ("/auth)
        login
        : signup
        : forgot
        : reset
    users: (/users)
        :get ("/)
        :post(:/)
        :get(/:id)
        delete(/:id)
        put(/:id)
    products:
    ......
controller:
    auth:
    products:
    user:
service: 
    user:
        findUser
        findUserById
    products:
    auth
utils:
    will have the function for doing specific tasks
    converting utc - ist
interfaces or something (give a proper name)
    : will have the abstract class like error and so
config
    : better if we keep all the configuration grouped
models:
    : for db models
repository:
    find(){
        return find()
    }

    findOne(query){
        return find(query)
    }

    update(query, data)
    return update(query,data,{upsert:true})





    (use spell checker extension)





    req:body:{
        productName: "xyz",
        variant:[
            {color:"red",imageUrls:[""]},
            {color:"green",imageUrls:['']}
        ]
    }


    const res = variant.map((im)=>{
        return upload()
    })

    
