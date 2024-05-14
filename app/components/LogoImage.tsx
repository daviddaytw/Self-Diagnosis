import Image from 'next/image'

export function LogoImage() {
    return (
        <div className='border-2 rounded-full overflow-hidden basis-12'>
            <Image src="/logo.jpg" alt="Self-Diagnosis Logo" width={48} height={48} />
        </div>
    )
}