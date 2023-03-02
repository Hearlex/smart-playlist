import IconButton from '@mui/joy/IconButton';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import Link from 'next/link';

export default function Player() {
    return (
        <>
            <Link href="/">
                <IconButton variant="plain" size="lg" sx={{color: 'white'}}>
                    <KeyboardReturnIcon />
                </IconButton>
            </Link>
        </>
    )
}