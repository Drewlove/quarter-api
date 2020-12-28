const UsersService = {
    getAllUsers(knex){
        return knex
        .select('*')
        .from('app_user')
    }, 
    getById(knex, id){
        return knex
        .from('app_user')
        .select('*')
        .where('app_user_id', id)
        .first()
    }, 
    insertUser(knex, newUser){
        return knex
        .insert(newUser)
        .into('app_user')
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    }, 
    updateUser(knex, id, newFields){
        return knex('app_user')
        .where({id})
        .update(newFields)
    }, 
    deleteUser(knex, id){
        return knex('app_user')
        .where({id})
        .delete()
    }
}

module.exports = UsersService