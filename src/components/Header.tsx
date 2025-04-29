import Navbar from "./pcomp/navbar";
import IconButton from "./pcomp/IconButton";
import {
  AppWindowIcon,
  Book,
  BookCheckIcon,
  BookCopy,
  Box,
  Braces,
  Brackets,
} from "lucide-react";

const Header = ({ref} : {  ref?: any}) => {
  return (
    <header ref={ref} className="fixed z-50 w-screen flex justify-between px-[3vw] items-center">
      <p className="text-white text-xl cursor-pointer">ARBO</p>
      <Navbar.Container>
        <Navbar.Item>
          <Navbar.Link>Project</Navbar.Link>
        </Navbar.Item>

        <Navbar.Item>
          <Navbar.DropdownTrigger id="dropdown1">
            Wet Lab
          </Navbar.DropdownTrigger>
          <Navbar.DropdownContent id="dropdown1" width={500} height={300}>
            <ul className="w-full h-full overflow-hidden grid grid-flow-col grid-cols-2 gap-0 p-0 m-0">
              <li className="w-fit">
                <IconButton
                  icon={
                    <BookCopy additive="replace" color="lightgrey" size={30} />
                  }
                  title="Lorem Ipsum"
                  desc="Lorem ipsum dolor sit amet."
                />
              </li>
              <li className="w-fit">
                <IconButton
                  icon={<Book additive="replace" color="lightgrey" size={30} />}
                  title="Lorem Ipsum"
                  desc="Lorem ipsum dolor sit amet."
                />
              </li>
              <li className="w-fit">
                <IconButton
                  icon={
                    <AppWindowIcon
                      additive="replace"
                      color="lightgrey"
                      size={30}
                    />
                  }
                  title="Lorem Ipsum"
                  desc="Lorem ipsum dolor sit amet."
                />
              </li>
              <li className="w-fit">
                <IconButton
                  icon={
                    <BookCheckIcon
                      additive="replace"
                      color="lightgrey"
                      size={30}
                    />
                  }
                  title="Lorem Ipsum"
                  desc="Lorem ipsum dolor sit amet."
                />
              </li>
              <li className="row-span-4">
                <div className="bg-foreground/10 cursor-pointer h-full flex ml-10 rounded-lg"></div>
              </li>
            </ul>
          </Navbar.DropdownContent>
        </Navbar.Item>

        <Navbar.Item>
          <Navbar.DropdownTrigger id="dropdown2">
            Dry Lab
          </Navbar.DropdownTrigger>
          <Navbar.DropdownContent id="dropdown2" width={300} height={220}>
            <ul className="w-full h-full overflow-hidden grid">
              <li className="w-fit">
                <IconButton
                  icon={
                    <Brackets additive="replace" color="lightgrey" size={30} />
                  }
                  title="Lorem Ipsum"
                />
              </li>
              <li className="w-fit">
                <IconButton
                  icon={
                    <Braces additive="replace" color="lightgrey" size={30} />
                  }
                  title="Lorem Ipsum"
                  desc="This one has a description."
                />
              </li>
              <li className="w-fit">
                <IconButton
                  icon={<Box additive="replace" color="lightgrey" size={30} />}
                  title="Lorem Ipsum"
                />
              </li>
            </ul>
          </Navbar.DropdownContent>
        </Navbar.Item>
        <Navbar.Item>
          <Navbar.Link>Team</Navbar.Link>
        </Navbar.Item>
        <Navbar.Item>
          <Navbar.Link>Community</Navbar.Link>
        </Navbar.Item>
      </Navbar.Container>
    </header>
  );
};

export default Header;
