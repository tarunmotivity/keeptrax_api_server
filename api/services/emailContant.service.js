
const { sendEmail } = require("./mail.services");
exports.welcomeMail = (name,password,email) =>{
    const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
     <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Invoice details</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
     </head>
      
      <body style="margin: 0; padding: 0; background-color:#eaeced " bgcolor="#eaeced">
       <table bgcolor="#eaeced" cellpadding="0" cellspacing="0" width="100%" style="background-color: #eaeced; ">
         <tr>
             <td>&nbsp;</td>
         </tr>
         <tr>
             <td>&nbsp;</td>
         </tr>
        <tr>
         <td>
          
           <table align="center" bgcolor="#ffffff" cellpadding="20" cellspacing="0" width="600" 
                  style="border-collapse: collapse; background-color: #ffffff; border: 1px solid #f0f0f0;">
             <tr>
              <td align="center" style="padding: 20px; border-top: 1px solid #f0f0f0; background: #fafafa; font-family: 'Open Sans',Helvetica,Arial,sans-serif; ">
              
               <h2 style="margin: 10px 0; color: #333; font-weight: 500; font-size: 48px;">
                  Welcome to keeptrax
               </h2>
              </td>
             </tr>
             <tr>
              <td align="center" style="padding: 20px 40px; font-family: 'Open Sans',Helvetica,Arial,sans-serif;font-size: 16px;line-height: 1.4;color: #333;">
                <div align="left">Dear ${name} </div>
                <div> Password is ${password}</div>
                <div><br></div>
                <div><br></div>
              </td>
             </tr>
             <tr style="border-top: 1px solid #eaeaea;">
               <td align="left">
                 <div style="font-family: 'Open Sans',Helvetica,Arial,sans-serif;font-size: 14px;line-height: 1.4;color: #777;">
                  Regards,<br>
                  KeepTrax team
                </div>
               </td>
             </tr>
           </table>
           
         </td>
        </tr>
         <tr>
             <td>&nbsp;</td>
         </tr>
         <tr>
             <td>&nbsp;</td>
         </tr>
       </table>
      </body>
      
    </html>`;
    sendEmail(email, "Welcome to keeptrax", html)
    
}