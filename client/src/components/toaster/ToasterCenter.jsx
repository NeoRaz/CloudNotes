import { Toaster } from 'react-hot-toast';

export const ToasterCenter = (props) => {
    // to use Toaster, you need to follow the following in your files:
    // import toast from 'react-hot-toast';
    // toast.success(message), toast.error(message), toast.warning(message), toast.info(message)
    // you can add duration to the toast as such:
    // toast.success(message, { duration: 5000 })

    return <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        toastOptions={{
            className: '',
            style: {
                fontSize: '1.1em',
                borderRadius: '6px',
                padding: '6px 16px 6px 16px',
            },
        }}
    />
}