import React from "react";
import { Separator } from "@workspace/ui/components/separator";
import { ArrowRight, MailOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { footerContent, paymentMethods, socialLinks } from "@/constants/site";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import Logo from "@/components/icon/Logo";

function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground [&_a:hover]:text-primary">
      <div className="flex justify-center container flex-wrap gap-y-12 py-[60px] lg:flex-nowrap lg:gap-12">
        {footerContent.map(({ title, items }, index) => (
          <div
            key={title}
            className={cn(
              "flex-1 basis-full md:basis-[calc(50%-48px)] lg:order-none",
              {
                "md:order-2": index > 0 && index < 3,
              }
            )}
          >
            {title === "Logo" ? (
              <Logo className="mb-4" />
            ) : (
              <h3 className="h4 mb-6 font-bold">{title}</h3>
            )}

            {title === "Newsletter" ? (
              <form className="flex w-1/2 flex-col gap-4 md:w-2/3 lg:w-full">
                <p className="body-2">Stay updated, enter your email!</p>
                <div className="shad-input-item flex items-center">
                  <MailOpen className="size-5 flex-shrink-0" />
                  <Input
                    type="text"
                    placeholder="Your Email"
                    className="shad-input"
                  />
                  <button type="submit" className="flex-shrink-0">
                    <ArrowRight className="size-5" />
                  </button>
                </div>
              </form>
            ) : (
              <ul className="flex flex-col gap-4">
                {items.map(({ label, url, Icon, external }) => (
                  <Link
                    href={url}
                    key={label}
                    className="flex items-center w-max gap-4"
                    target={external ? "_blank" : "_self"}
                  >
                    {Icon && <Icon />}
                    {label}
                  </Link>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <Separator />
      <div className="flex items-center justify-between container gap-y-4 py-4 max-md:flex-wrap">
        <div className="flex items-center gap-2 max-md:w-full max-md:justify-center">
          {paymentMethods.map(({ label, url }) => (
            <Image
              key={label}
              src={url}
              alt={label}
              width={10}
              height={10}
              className="h-6 w-10 rounded-sm border bg-white object-cover px-2 shadow-light"
            />
          ))}
        </div>
        <p>&copy; 2024 Krist. All rights reserved.</p>
        <div className="flex items-center gap-4">
          {socialLinks.map(({ label, url, Icon }) => (
            <Link
              href={url}
              key={label}
              target="_blank"
              className="flex-center"
            >
              {Icon && <Icon className="size-5" />}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
