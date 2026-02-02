
import { Footer } from 'flowbite-react';
import { useSelector } from 'react-redux';

export default function DefaultFooter() {
  const isLogged = useSelector((state) => state.auth?.isLogged);

  if (!isLogged) return null;
  return (
    <Footer container>
      <Footer.Copyright
        by="Linkuup"
        href="#"
        year={2023}
      />
      <Footer.LinkGroup>
        <Footer.Link href="/about">
          About
        </Footer.Link>
        <Footer.Link href="#">
          Privacy Policy
        </Footer.Link>
        <Footer.Link href="#">
          Licensing
        </Footer.Link>
        <Footer.Link href="#">
          Contact
        </Footer.Link>
      </Footer.LinkGroup>
    </Footer>
  )
}


