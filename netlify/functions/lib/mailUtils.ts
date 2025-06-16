export function makeHtmlEmail(subject: string, content: string): string {
	return `\
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="de">\
<head>\
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
<meta http-equiv="X-UA-Compatible" content="IE=edge" />\
<meta name="viewport" content="width=device-width, initial-scale=1.0" />\
<title>${subject}</title>\
</head>\
<body style="margin: 0; padding: 0; min-width: 100%; background-color: #cecac0; color: #000000">\
<!--[if (gte mso 9)|(IE)]>\
<style type="text/css">\
body { background-color: #cecac0; !important; color: #000000; }\
body, table, td, p, a { font-family: Verdana, Arial, sans-serif; }\
</style>\
<![endif]-->\
<table \
border="0" cellpadding="0" role="presentation" \
style="width: 100%; border-spacing: 0; font-size: 16px; background-color: #cecac0; \
color: #000000; font-family: Arial, sans-serif;">\
<tbody><tr><td style="vertical-align: top">\
<!--[if mso | IE]>\
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="width: 600px">\
<tr><td>\
<![endif]-->\
<table align="center" style="border-spacing: 0; width: 100%; max-width: 700px; padding: 35px 20px 35px 20px; margin: 0 auto">\
<tbody><tr><td style="vertical-align: top"> \
${content} \
</td></tr></tbody>\
</table>\
<!--[if mso | IE]>\
</td></tr></table>\
<![endif]-->\
</td></tr></tbody>\
</table>\
</body>\
</html>\
`;
}
