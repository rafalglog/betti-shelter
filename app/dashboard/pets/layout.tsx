interface PetsLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

const PetsLayout = ({ children, modal }: PetsLayoutProps) => {
  return (
    <>
      {children}
      {modal}
    </>
  );
};

export default PetsLayout;
