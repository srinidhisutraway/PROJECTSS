public class BinaryAdd {
    public static void main(String[] args) {
        String a="11";
        String b="1";
        StringBuilder sb=new StringBuilder();
        int i=a.length()-1;
        int j=b.length()-1;
        int carry=0;
        while(i>=0 || j>=0 || carry==1){
            int sum=carry;
            if(i>=0){
                sum=sum+a.charAt(i)-'0';
                i--;
            }
            if(j>=0){
                sum=sum+b.charAt(j)-'0';
                j--;
            }
            sb.append(sum%2);
            carry=sum/2;
        }
        System.out.println(sb.reverse().toString());
        
    }
}
    
