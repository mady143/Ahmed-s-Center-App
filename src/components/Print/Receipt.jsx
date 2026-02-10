import React, { forwardRef } from 'react';

const Receipt = forwardRef(({ cart, total, paymentMethod = 'Cash', orderNo, timestamp }, ref) => {
    const receiptDate = timestamp ? new Date(timestamp) : new Date();
    const date = receiptDate.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const billNo = orderNo || `IAA-${Math.floor(Math.random() * 1000)}`;

    return (
        <div ref={ref} style={{
            padding: '20px',
            color: '#000',
            backgroundColor: '#fff',
            width: '100%',
            maxWidth: '300px',
            margin: '0 auto',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '12px',
            lineHeight: '1.4',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Watermarks */}
            <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%) rotate(-25deg)', fontSize: '24px', opacity: 0.08, fontWeight: '900', color: '#000', whiteSpace: 'nowrap', pointerEvents: 'none', width: '100%', textAlign: 'center' }}>AHMED'S CENTER</div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-25deg)', fontSize: '24px', opacity: 0.08, fontWeight: '900', color: '#000', whiteSpace: 'nowrap', pointerEvents: 'none', width: '100%', textAlign: 'center' }}>AHMED'S CENTER</div>
            <div style={{ position: 'absolute', top: '85%', left: '50%', transform: 'translate(-50%, -50%) rotate(-25deg)', fontSize: '24px', opacity: 0.08, fontWeight: '900', color: '#000', whiteSpace: 'nowrap', pointerEvents: 'none', width: '100%', textAlign: 'center' }}>AHMED'S CENTER</div>

            <div style={{ textAlign: 'center', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
                <p style={{ margin: 0, fontSize: '10px' }}>Powered by Ahmed's Center :)</p>
                <h2 style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold' }}>Ahmed's Center</h2>
                <p style={{ margin: 0 }}>+918801788115</p>
                <p style={{ marginTop: '10px' }}>---------------------------------</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', position: 'relative', zIndex: 1 }}>
                <span>Order No: {billNo}</span>
                <span>{date}</span>
            </div>
            <p style={{ margin: 0, position: 'relative', zIndex: 1 }}>---------------------------------</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 0.5fr 1fr', gap: '2px', fontWeight: 'bold', margin: '5px 0', position: 'relative', zIndex: 1 }}>
                <span>Item</span>
                <span style={{ textAlign: 'right' }}>Rate</span>
                <span style={{ textAlign: 'center' }}>Qty</span>
                <span style={{ textAlign: 'right' }}>Amount</span>
            </div>
            <p style={{ margin: 0, position: 'relative', zIndex: 1 }}>---------------------------------</p>

            <div style={{ margin: '5px 0', position: 'relative', zIndex: 1 }}>
                {cart.map(item => (
                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 0.5fr 1fr', gap: '2px', marginBottom: '3px' }}>
                        <span style={{ textTransform: 'uppercase', fontSize: '11px' }}>{item.name}</span>
                        <span style={{ textAlign: 'right' }}>{item.price.toFixed(2)}</span>
                        <span style={{ textAlign: 'center' }}>{item.quantity}</span>
                        <span style={{ textAlign: 'right' }}>{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>
            <p style={{ margin: 0, position: 'relative', zIndex: 1 }}>---------------------------------</p>

            <div style={{ margin: '10px 0', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total items</span>
                    <span>{totalItems}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <span>{total.toFixed(2)}</span>
                </div>
            </div>

            <div style={{ borderTop: '1px dashed #000', padding: '10px 0', marginTop: '10px', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>Total Amount</span>
                    <span style={{ fontSize: '24px', fontWeight: '900' }}>₹{total.toFixed(2)}</span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', position: 'relative', zIndex: 1 }}>
                <span>Payment Method</span>
                <span style={{ fontWeight: 'bold' }}>{paymentMethod}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', position: 'relative', zIndex: 1 }}>
                <span>Amount Received</span>
                <span>{total.toFixed(2)}</span>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px', position: 'relative', zIndex: 1 }}>
                <p style={{ margin: 0 }}>---------------------------------</p>
                <p style={{ margin: '5px 0' }}>Thank you for visiting us!</p>
                <p style={{ margin: 0 }}>*********************************</p>
            </div>
        </div>
    );
});

export default Receipt;
