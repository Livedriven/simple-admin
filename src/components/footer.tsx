export default function Footer(){
    return (
        <>
            <footer className="container-footer">
                <p>Desenvolvido por Richard Henrique</p>
                <p>{new Date().getFullYear()}</p>
            </footer>
        </>
    )
}