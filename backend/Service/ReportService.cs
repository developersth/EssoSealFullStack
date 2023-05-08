using System.Text;
using AspNetCore.Reporting;
namespace EssoDotnetCoreWebApi
{
    public class ReportService
    { 
        public static  byte[] CreateReportFile(string pathRdlc)
        {

            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            LocalReport report = new LocalReport(pathRdlc);
            List<Users> l = new List<Users>();
            l.Add(new Users
            {
                FirstName = "mathus",
                LastName = "nakpansua",
                Email = "mathus057@gmail.com",
                Phone = "0839999999"
            });

            report.AddDataSource("DataSet1", l);
            var result = report.Execute(RenderType.Pdf, 1);
            return result.MainStream;
        }
    }
}
