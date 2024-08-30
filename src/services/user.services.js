import userRepository from "../persistence/mongoDB/user.repository.js";

const loginAuthenticateToken = async () => {
    return await userRepository.getByEmail(email);
};


export default {
    loginAuthenticateToken    
}