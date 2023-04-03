using System;
using System.Collections.Generic;
using System.Text;

namespace EssoDotnetCoreWebApi
{
    public interface IUsersRespository
    {
        List<User> GetUsers();

        User CreateUser(User obj);

        User UpdateUser(User obj);

        void Delete(string id);
    }
}
