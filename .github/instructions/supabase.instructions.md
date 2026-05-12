# Supabase Integration Instructions

Use when: Writing Supabase queries, working with database operations, handling authentication, managing storage operations.

## Quick Reference

### Data Queries
```javascript
// Select with filters
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', value)
  .order('created_at', { ascending: false });

// Insert data
const { data, error } = await supabase
  .from('table_name')
  .insert([{ column: value }]);

// Update data
const { data, error } = await supabase
  .from('table_name')
  .update({ column: newValue })
  .eq('id', id);

// Delete data
const { data, error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', id);
```

### Real-time Subscriptions
```javascript
const subscription = supabase
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'table_name',
    filter: `column=eq.${value}`
  }, payload => {
    console.log('Change received!', payload);
  })
  .subscribe();

// Cleanup: subscription.unsubscribe();
```

### Authentication
```javascript
// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Sign out
await supabase.auth.signOut();
```

### Storage Operations
```javascript
// Upload file
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload('path/to/file', file);

// Download file
const { data, error } = await supabase.storage
  .from('bucket-name')
  .download('path/to/file');

// Get public URL
const { data } = supabase.storage
  .from('bucket-name')
  .getPublicUrl('path/to/file');
```

### Error Handling
Always check for errors after Supabase operations:
```javascript
if (error) {
  console.error('Database error:', error.message);
  // Show user-friendly error via StatusModal
  showError(error.message);
}
```

## RLS Policy Checks
Before querying a table:
1. Verify RLS is enabled on the table
2. Check policies for current user's role
3. Ensure authenticated user has permission to access data
4. Test queries with different roles (Admin/Biller/Guest)

## Common Patterns in This Project

### Sales/Order Queries
- Use `order_id` from orderIdGenerator for unique transactions
- Filter by date range for reports
- Include wastage calculations in totals

### Product Queries
- Store images in Supabase Storage
- Cache product list in context for performance
- Update in real-time when admin modifies products

### User Role Checking
- Query user role from auth metadata
- Apply UI-level filtering based on role
- Enforce role checks in Supabase RLS policies

## Performance Tips
- Use pagination for large datasets
- Select only needed columns (avoid SELECT *)
- Use indexes on frequently filtered columns
- Consider caching frequently accessed data
