import { footerNavs } from "../constants/FooterNavs";
import { socialNavs } from "../constants/SocialNavs";
import lightImg from "@/assets/images/LOGO.png"

function Footer() {
  return (
    <footer className="w-full p-5 gap-10 md:gap-0 md:p-12 grid grid-cols-1 md:grid-cols-4 text-white dark:border-t border-blue-300/20 py-10 px-4 sm:px-6 md:px-16 bg-gray-900">
      <main className="flex flex-col md:min-h-[15rem] col-span-1">
        <img
          src={lightImg}
          alt="logo"
          loading="lazy"
          width={55}
        />
        <p className="font-light mb-5 my-3">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. In,
          reiciendis? Lorem ipsum dolor, sit amet consectetur adipisicing
        </p>

        <div className="flex gap-5 items-center mt-auto">
          {socialNavs.map((link) => (
            <a
              key={link.name}
              href={link.url}
              className={`text-[#808080] transition-all hover:text-blue-300/20`}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </main>

      <nav className="col-span-3 font-light text-gray-300 text-md">
        <main className="w-full flex flex-col md:flex-row flex-shrink-0 md:justify-end gap-5 md:gap-16 justify-between items-start">
          {footerNavs.map((group, i) => (
            <table key={i}>
              <tbody>
                <tr>
                  <th className={`text-white font-semibold text-left pb-5`}>
                    {group[0]?.category}
                  </th>
                </tr>
                <tr>
                  <td className="flex flex-col gap-5">
                    {group.map((footer) => (
                      <a key={footer.text} href={footer.href}>
                        {footer.text}
                      </a>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          ))}
        </main>
      </nav>
    </footer>
  );
}

export default Footer;
