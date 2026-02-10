const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zgkfrpahsrcbwbwsxsoz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna2ZycGFoc3JjYndid3N4c296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTkxNDUsImV4cCI6MjA4NTYzNTE0NX0.0LEkDqva-xaIMTDOvFb_vzs47it82ZVloUlzyVQdNJ8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testGuestInsert() {
    console.log('Attempting to insert test sale as guest (anon)...');

    const testSale = {
        items: JSON.stringify([{ id: 'test', name: 'Test Item', price: 10, quantity: 1 }]),
        total: 10,
        payment_method: 'Test'
    };

    const { data, error } = await supabase
        .from('sales')
        .insert([testSale])
        .select()
        .single();

    if (error) {
        console.error('❌ Failed to insert sale:', error.message);
        console.error('Full Error:', JSON.stringify(error, null, 2));
    } else {
        console.log('✅ Successfully inserted sale!');
        console.log('Inserted Data:', data);

        // Clean up test data if possible (though anon might not have delete permissions, which is fine)
        /*
        const { error: deleteError } = await supabase
            .from('sales')
            .delete()
            .eq('id', data.id);
            
        if (deleteError) console.log('Note: Could not delete test data (expected for anon):', deleteError.message);
        else console.log('Cleaned up test data.');
        */
    }
}

testGuestInsert();
