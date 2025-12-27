create table public.purchased_orders (
    id bigint generated always as identity primary key,
    PO text not null,
    supplier text,
    transactionDate date,
    deliveryDate date,
    total numeric,
    approvalStatus text,
    deliveryStatus text,
    paymentStatus text,
    remarks text,
    quantity integer,
    items jsonb
);
