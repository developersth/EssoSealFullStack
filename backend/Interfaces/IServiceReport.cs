using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EssoDotnetCoreWebApi
{
    public interface IServiceReport
    {
        byte[] CreateReportFile(string pathRdlc);
    }
}
